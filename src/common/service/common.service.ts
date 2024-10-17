import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/modules/admin/entities/admin.entity';
import { Class } from 'src/modules/class/entities/class.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Dzongkhag } from 'src/modules/school/entities/dzongkhag.entity';
import { School } from 'src/modules/school/entities/school.entity';
import { Subject } from 'src/modules/subject/entities/subject.entity';
import { Textbook } from 'src/modules/textbook/entities/textbook.entity';
import { Users } from 'src/modules/user/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Dzongkhag)
    private dzongkhagRepository: Repository<Dzongkhag>,
    @InjectRepository(School) private schoolRepository: Repository<School>,
    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Textbook)
    private textbookRepository: Repository<Textbook>,
  ) {}

  async getAllDzongkhag(dzongkhagName?: string) {
    const query = this.dzongkhagRepository
      .createQueryBuilder('dzongkhag')
      .select(['dzongkhag.id', 'dzongkhag.name']);

    if (dzongkhagName) {
      query.where('dzongkhag.name ILIKE :name', { name: `${dzongkhagName}%` });
    }

    const dzongkhag = await query.getMany();

    if (!dzongkhag || dzongkhag.length === 0) {
      throw new NotFoundException('No dzongkhag found!');
    }

    return dzongkhag;
  }

  async getAllSchool(schoolName?: string) {
    const query = this.schoolRepository
      .createQueryBuilder('school')
      .leftJoinAndSelect('school.dzongkhag', 'dzongkhag')
      .select([
        'school.id',
        'school.schoolName',
        'dzongkhag.name',
        'dzongkhag.id',
      ]);

    if (schoolName) {
      query.where('school.schoolName ILIKE :schoolName', {
        schoolName: `${schoolName}%`,
      });
    }

    const schools = await query.getMany();

    if (!schools || schools.length === 0) {
      throw new NotFoundException('No school found!');
    }
    return schools.map((school) => ({
      school: school.schoolName,
      dzongkhagName: school.dzongkhag.name,
      schoolId: school.id,
      dzongkhagId: school.dzongkhag.id,
    }));
  }

  async getSubjectByClass(classId: string) {
    const subjects = await this.subjectRepository.find({
      where: { class: { id: classId } },
      relations: ['class'],
      select: ['id', 'subjectName'],
    });

    if (!subjects || subjects.length === 0) {
      throw new NotFoundException('Class not found or no subjects available!');
    }

    return subjects.map((subject) => ({
      className: subject.class.class,
      classId: subject.class.id,
      subjectName: subject.subjectName,
      subjectId: subject.id,
    }));
  }

  ///////////////////
  async getAllSubject() {
    const classes = await this.classRepository.find({
      select: ['id', 'class'],
      relations: ['subjects'],
    });

    if (!classes || classes.length === 0) {
      throw new NotFoundException('Empty class in database!');
    }

    return classes.map((cls) => ({
      classId: cls.id,
      className: cls.class,
      subjects: cls.subjects.map((subject) => ({
        id: subject.id,
        subjectName: subject.subjectName,
      })),
    }));
  }

  async getDzongkhag() {
    const dzongkhags = await this.dzongkhagRepository.find({
      select: ['id', 'name'],
      relations: ['gewog'],
    });

    if (!dzongkhags || dzongkhags.length === 0) {
      throw new NotFoundException('Empty class in database!');
    }
    return dzongkhags.map((dzo) => ({
      dzongkhagId: dzo.id,
      name: dzo.name,
      gewogs: dzo.gewog.map((geo) => ({
        id: geo.id,
        name: geo.name,
      })),
    }));
  }

  //   async getDashboardItem() {
  //     const repositories = {
  //       schools: this.schoolRepository,
  //       users: this.userRepository,
  //       admins: this.adminRepository,
  //       textbooks: this.textbookRepository,
  //       subjects: this.subjectRepository,
  //       roles: this.roleRepository,
  //       permissions: this.permissionRepository,
  //     };

  //     const promises = Object.entries(repositories).map(
  //       async ([name, repository]) => {
  //         const [, count] = await repository.findAndCount();
  //         return { name, count };
  //       },
  //     );

  //     const results = await Promise.all(promises);

  //     return results;
  //   }

  async getDashboardItem() {
    const repositories = {
      schools: {
        repository: this.schoolRepository,
        color: 'primary',
        icon: 'ri-graduation-cap-line',
      },
      users: {
        repository: this.userRepository,
        color: 'secondary',
        icon: 'ri-user-line',
      },
      admins: {
        repository: this.adminRepository,
        color: 'warning',
        icon: 'ri-shield-user-line',
      },
      textbooks: {
        repository: this.textbookRepository,
        color: 'info',
        icon: 'ri-book-3-line',
      },
      subjects: {
        repository: this.subjectRepository,
        color: 'success',
        icon: 'ri-git-repository-line',
      },
      roles: {
        repository: this.roleRepository,
        color: 'error',
        icon: 'ri-vip-crown-line',
      },
      permissions: {
        repository: this.permissionRepository,
        color: 'default',
        icon: 'ri-key-line',
      },
    };
    const promises = Object.entries(repositories).map(
      async ([name, { repository, color, icon }]) => {
        const [, count] = await repository.findAndCount();
        return { name, count, color, icon };
      },
    );

    const results = await Promise.all(promises);

    return results;
  }
}
